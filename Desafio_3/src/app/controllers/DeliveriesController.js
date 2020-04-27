// import { Op } from 'sequelize';

import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Orders from '../models/Order';

class DeliveriesController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists.' });
    }

    const orders = await Orders.findAll({
      where: { deliveryman_id: id, canceled_at: null, ended_at: null },
      order: [['id', 'DESC']],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'street', 'number', 'country', 'city'],
        },
      ],
    });

    return res.json(orders);
  }
}

export default new DeliveriesController();
