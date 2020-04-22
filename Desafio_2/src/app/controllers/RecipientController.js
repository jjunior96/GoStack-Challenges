import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string().required(),
      country: Yup.string().required(),
      city: Yup.string().required(),
      postcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails.' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      country,
      city,
      postcode,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      country,
      city,
      postcode,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string().required(),
      country: Yup.string().required(),
      city: Yup.string().required(),
      postcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails.' });
    }

    const {
      name,
      street,
      number,
      complement,
      country,
      city,
      postcode,
    } = req.body;

    await recipient.update({
      name,
      street,
      number,
      complement,
      country,
      city,
      postcode,
    });

    await recipient.save();

    return res.json(recipient);
  }
}

export default new RecipientController();