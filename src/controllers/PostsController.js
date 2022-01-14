import Post from '../models/Post';
import TryCatch from '../decorators/TryCatchMiddlewareDecorator';
import HttpError from '../exeptions/HttpError';

class PostsController {
  @TryCatch
  static async read(req, res) {
    const post = await PostsController.getPostById(req.params.id);
    res.json([post, req.tokens]);
  }

  @TryCatch
  static async list(req, res) {
    const posts = await Post.find();
    res.json([posts, req.tokens]);
  }

  @TryCatch
  static async create(req, res) {
    console.log(`middleware "Authorize" добавил userId:${req.userId} в request`);
    const model = new Post({ ...req.body, authorId: req.userId });
    console.log('Сформировали данные для их сохранения в коллекции БД', model);
    const post = await model.save();

    res.json([{ status: true, post }, req.tokens]);
  }

  @TryCatch
  static async update(req, res) {
    const post = await PostsController.getPostById(req.params.id);

    if (req.userId !== post.authorId) {
      throw new HttpError('Access in closed', 403);
    }

    post.header = req.body.header;
    post.content = req.body.content;
    await post.save();

    res.json([{ status: true, post }, req.tokens]);
  }

  @TryCatch
  static async delete(req, res) {
    const post = await PostsController.getPostById(req.params.id);

    if (req.userId !== post.authorId) {
      throw new HttpError('Access in closed', 403);
    }

    await post.delete();

    if (!req.tokens) {
      res.json(['delete', req.tokens]);
    }

    res.status(204).end();
  }


  static async getPostById(id) {
    const post = await Post.findById(id);

    if (!post) {
      throw new HttpError('Post not found', 404);
    }

    return post;
  }
}

export default PostsController;
