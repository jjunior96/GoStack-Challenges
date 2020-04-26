import * as Yup from 'yup';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
// import File from '../models/Files';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll();

    if (!orders) {
      return res.status(400).json({ error: 'Not exists orders.' });
    }

    return res.json(orders);
  }

  async show(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists.' });
    }

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { product, recipient_id, deliveryman_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.statu(401).json({ error: 'Deliveryman does not exists.' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.statu(401).json({ error: 'Recipient does not exists.' });
    }

    const { id } = await Order.create({
      product,
      recipient_id,
      deliveryman_id,
    });

    return res.json({
      id,
      product,
      recipient,
      deliveryman,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).jsoon({ error: 'Validation fails.' });
    }

    const { product, recipient_id, deliveryman_id } = req.body;

    const order = await Order.findByPk(id);

    order.update({ product, recipient_id, deliveryman_id });

    order.save();

    return res.json(order);
  }

  async delete(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists.' });
    }

    order.destroy();

    return res.json(order);
  }
}

export default new OrderController();
