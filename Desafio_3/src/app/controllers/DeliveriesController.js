import {
  // isAfter,
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  parseISO,
} from 'date-fns';

import { Op } from 'sequelize';

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

  async update(req, res) {
    const { start_at, order_id } = req.body;

    const startInterval = setSeconds(
      setMinutes(setHours(parseISO(start_at), 8), 0),
      0
    );

    const endInterval = setSeconds(
      setMinutes(setHours(parseISO(start_at), 18), 0),
      0
    );

    const { id } = req.params;

    if (!isBefore(parseISO(start_at), endInterval)) {
      return res
        .status(400)
        .json({ error: 'Withdrawal available between 08:00 and 18:00' });
    }

    const order = await Orders.findByPk(order_id);

    if (order.start_at) {
      return res.status(400).json({ error: 'Order already withdrawn.' });
    }

    const withdrawnOrder = await Orders.findAll({
      where: {
        deliveryman_id: id,
        start_at: { [Op.between]: [startInterval, endInterval] },
      },
    });

    if (withdrawnOrder.length === 5) {
      return res
        .status(400)
        .json({ error: 'You can only take 5 orders per day.' });
    }

    order.update({ start_at });
    order.save();

    return res.json(withdrawnOrder);
  }
}

export default new DeliveriesController();
