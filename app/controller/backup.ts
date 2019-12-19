import { Controller } from 'egg';

export default class BackupController extends Controller {
  public async index() {
    const { ctx } = this;
    await ctx.render('project/index');
  }

  public async use() {
    const { ctx } = this;
    ctx.body = 'build';
  }
}
