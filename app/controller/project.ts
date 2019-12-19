import { Controller } from 'egg';
import { dirname } from 'path';
import { Stats } from 'fs';
import * as moment from 'moment';

export default class ProjectController extends Controller {
    public async index() {
        const { ctx } = this;
        const projects = JSON.parse(JSON.stringify(ctx.app.config.projects));
        Object.keys(projects).forEach(name => {
            try {
                const stats: Stats = ctx.service.linux.pathInfo(dirname(__dirname) + '/public/projects/' + name + '/files.zip');
                projects[name].info = {
                    size: (stats.size / 1024).toFixed(2) + 'KB',
                    ctime: moment(stats.ctime).format('YYYY-MM-DD hh:mm:ss'),
                };
            } catch (_e) {
                // pass
            }
        });

        await ctx.render('project/index', {
            projects,
        });
    }

    public async build() {
        const { ctx } = this;
        const { name } = ctx.request.body;
        const project = ctx.app.config.projects[name];
        if (!project) {
            ctx.body = ctx.helper.apiError('项目不存在');
            return;
        }
        const commands: string[] = [];
        // 2.1 前往目标文件夹
        const appRootDir = dirname(dirname(__dirname));
        const tmpBuildProjectDir = '~/tmp_build_projects/' + name;
        commands.push('mkdir -p ' + tmpBuildProjectDir);
        commands.push('cd ' + tmpBuildProjectDir);
        // 2.2 清理工作文件夹
        const tmpBuildProjectTimeDir = 'tmp_builder_' + new Date().getTime();
        commands.push('mkdir ' + tmpBuildProjectTimeDir);
        commands.push('cd ' + tmpBuildProjectTimeDir);
        // 2.3 拉取项目
        commands.push('git clone ' + project.git + ' ./');
        // 2.4 拉取配置（挂载）
        if (project.config) {
            const configFile = appRootDir + '/config/projects/' + name + '/*';
            commands.push('cp ' + configFile + ' ./');
        }
        // 2.4.1 拉取node_modules
        commands.push('mkdir -p ' + tmpBuildProjectDir + '/node_modules'); // 以防文件夹不存在
        commands.push('cp ' + tmpBuildProjectDir + '/node_modules ./ -R');
        // 2.5 安装依赖
        commands.push('yarn');
        // 2.6 清理无关内容（.git）
        commands.push('rm .git -rf');
        // 2.7 压缩文件
        commands.push('zip -r files.zip ./*');
        // 2.8 移入构建结果文件夹
        const projectDir = appRootDir + '/app/public/projects/' + name;
        commands.push('mkdir -p ' + projectDir);
        commands.push('cp ' + tmpBuildProjectDir + '/' + tmpBuildProjectTimeDir + '/files.zip ' + projectDir + '/');
        // 2.9 留存node_modules，以备下次提速
        commands.push('cp ' + tmpBuildProjectDir + '/' + tmpBuildProjectTimeDir + '/node_modules ../ -R');
        // 2.10 清理临时文件夹
        commands.push('rm ' + tmpBuildProjectDir + '/' + tmpBuildProjectTimeDir + ' -rf');

        const commandStr = commands.join(' && ');
        console.log(`[${name}]开始构建：${new Date().toLocaleString()}`);
        ctx.service.linux.exec(commandStr).then(() => {
            console.log(`[${name}]构建完成：${new Date().toLocaleString()}`);
        }).catch((err: Error) => {
            console.log(`[${name}]构建失败：${new Date().toLocaleString()}`);
            console.error(`[${name}]构建失败：${err.message}`);
        });
        ctx.body = ctx.helper.apiSuccess(commandStr);
    }
}
