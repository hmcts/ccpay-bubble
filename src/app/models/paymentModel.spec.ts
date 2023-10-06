import { PaymentModel } from './PaymentModel';

describe('Payment model', () => {
  it('Should reset payment model', () => {
    const paymentModel = new PaymentModel();
    paymentModel.amount = 0;
    paymentModel.ccd_case_number = '123';
    paymentModel.currency = 'GBP';
    paymentModel.service = 'Divorce';
    paymentModel.site_id = '123';
    paymentModel.description = 'test desc';
    paymentModel.channel = 'telephony';
    paymentModel.provider = 'pci pal';
    PaymentModel.reset(paymentModel);
    expect(paymentModel.amount).toBe(null);
    expect(paymentModel.ccd_case_number).toBe('');
    expect(paymentModel.currency).toBe('GBP');
    expect(paymentModel.service).toBe('');
    expect(paymentModel.fees).toEqual([]);
  });

  it('Should clean a model of unused properties and populate with default', () => {
    const paymentModel = new PaymentModel();
    paymentModel.ccd_case_number = '123';
    paymentModel.currency = 'GBP';
    paymentModel.provider = 'pci pal';
    PaymentModel.cleanModel(paymentModel);
  });
});
