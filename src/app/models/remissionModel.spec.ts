import { RemissionModel } from './RemissionModel';

describe('Remission model', () => {
  it('Should reset remission model', () => {
    const remissionModel = new RemissionModel();
    remissionModel.beneficiary_name = 'test';
    remissionModel.ccd_case_number = '123';
    remissionModel.hwf_amount = 123;
    remissionModel.hwf_reference = 'Divorce';
    remissionModel.payment_group_reference = '123';
    RemissionModel.reset(remissionModel);
    expect(remissionModel.beneficiary_name).toBe('');
    expect(remissionModel.ccd_case_number).toBe('');
    expect(remissionModel.fee).toBe(null);
    expect(remissionModel.hwf_amount).toBe(null);
    expect(remissionModel.hwf_reference).toBe('');
    expect(remissionModel.payment_group_reference).toBe('');
  });

  it('Should clean a model of unused properties and populate with default', () => {
    const remissionModel = new RemissionModel();
    remissionModel.beneficiary_name = 'test';
    remissionModel.ccd_case_number = '123';
    remissionModel.hwf_amount = 123;
    const resultModel = RemissionModel.cleanModel(remissionModel);
    expect(remissionModel.beneficiary_name).toEqual('test');
    expect(remissionModel.ccd_case_number).toEqual('123');
    expect(remissionModel.hwf_amount).toEqual(123);
  });

  it('Should clean a model of undefined properties and populate with default', () => {
    const remissionModel = new RemissionModel();
    const resultModel = RemissionModel.cleanModel(remissionModel);
    expect(remissionModel.ccd_case_number).toBeUndefined();
    expect(remissionModel.site_id).toEqual('AA02');

  });

  it('Should clean a model of null properties and populate with default', () => {
    const remissionModel = new RemissionModel();
    remissionModel.site_id = null;
    const resultModel = RemissionModel.cleanModel(remissionModel);
    expect(remissionModel.ccd_case_number).toBeUndefined();
    expect(remissionModel.site_id).toEqual('AA02');

  })


  it('Should rest a model ', () => {
    const remissionModel = new RemissionModel();
    remissionModel.beneficiary_name = 'test';
    remissionModel.ccd_case_number = '123';
    remissionModel.hwf_amount = 123;
    const resultModel = RemissionModel.reset(remissionModel);
    expect(remissionModel.beneficiary_name).toEqual('');
    expect(remissionModel.ccd_case_number).toEqual('');
  });



  it('Should rest a model ', () => {
    const remissionModel = new RemissionModel();
    remissionModel.beneficiary_name = 'test';
    remissionModel.ccd_case_number = '123';
    remissionModel.hwf_amount = 123;
    new RemissionModel().assign(remissionModel);
    expect(remissionModel.beneficiary_name).toEqual('test');
    expect(remissionModel.ccd_case_number).toEqual('123');
  });
});
