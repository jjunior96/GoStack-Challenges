// import * as Yup from 'yup';
// import User from '../models/User';

class UserController {
  async store(req, res) {
    return res.json({ ok: true });
  }
}

export default new UserController();
