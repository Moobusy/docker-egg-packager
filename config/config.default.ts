import {EggAppConfig, EggAppInfo, PowerPartial} from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;
    config.keys = appInfo.name + '_1576656472835_3256';
    config.middleware = [];

    config.view = {
        defaultExtension: '.nj',
        defaultViewEngine: 'nunjucks',
    };

    config.security = {
        csrf: {
            ignore: ['/'],
        },
    };
    config.cluster = {
        listen: {
            hostname: '0.0.0.0',
            port: 7001,
        },
    };

    // dir：项目目录
    // git：项目地址
    // config：配置文件路径，存在于/config/projects/${dir}/
    config.projects = {
        'msw-front-server': {
            git: 'http://liangmu:123456@git.meishujun.com/frontend/server.git',
            config: true,
        },
    };

    return config;
};
