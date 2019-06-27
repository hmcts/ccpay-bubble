export const mockFees = [
  {
    code: 'FEE0001',
    fee_type: 'fixed',
    sort_value: 0,
    channel_type: {
      name: 'default'
    },
    event_type: {
      name: 'issue'
    },
    jurisdiction1: {
      name: 'civil'
    },
    jurisdiction2: {
      name: 'county court'
    },
    service_type: {
      name: 'civil money claims'
    },
    applicant_type: {
      name: 'all'
    },
    fee_versions: [
      {
        description: 'Civil Court fees - Money Claims - Claim Amount - Unspecified',
        status: 'approved',
        version: 1,
        valid_from: '2014-04-22T00:00:00.000+0000',
        valid_to: '2014-04-22T00:00:00.000+0000',
        flat_amount: {
          amount: 10000
        },
        memo_line: 'GOV - Paper fees - Money claim >£200,000',
        natural_account_code: '4481102133',
        direction: 'enhanced'
      },
      {
        description: 'Money Claims - Claim Amount - Unspecified',
        status: 'approved',
        author: '124756',
        approvedBy: '39907',
        version: 2,
        valid_from: '2014-04-22T00:00:00.000+0000',
        flat_amount: {
          amount: 10000
        },
        memo_line: 'RECEIPT OF FEES - Civil issue money',
        statutory_instrument: '2015 No 576',
        si_ref_id: '1.1i',
        natural_account_code: '4481102133',
        fee_order_name: 'Civil Proceedings',
        direction: 'enhanced'
      }
    ],
    current_version: {
      description: 'Money Claims - Claim Amount 500 - Unspecified',
      status: 'approved',
      author: '124756',
      approvedBy: '39907',
      version: 2,
      valid_from: '2014-04-22T00:00:00.000+0000',
      flat_amount: {
        amount: 10000
      },
      memo_line: 'RECEIPT OF FEES - Civil issue money',
      statutory_instrument: '2015 No 576',
      si_ref_id: '1.1i',
      natural_account_code: '4481102133',
      fee_order_name: 'Civil Proceedings',
      direction: 'enhanced'
    },
    unspecified_claim_amount: true
  },
  {
    code: 'FEE0002',
    fee_type: 'fixed',
    sort_value: 0,
    channel_type: {
      name: 'default'
    },
    event_type: {
      name: 'issue'
    },
    jurisdiction1: {
      name: 'civil'
    },
    jurisdiction2: {
      name: 'county court'
    },
    service_type: {
      name: 'civil money claims'
    },
    applicant_type: {
      name: 'all'
    },
    fee_versions: [
      {
        description: 'Test description',
        status: 'approved',
        version: 1,
        valid_from: '2014-04-22T00:00:00.000+0000',
        valid_to: '2014-04-22T00:00:00.000+0000',
        flat_amount: {
          amount: 10000
        },
        memo_line: 'GOV - Paper fees - Money claim >£200,000',
        natural_account_code: '4481102133',
        direction: 'enhanced'
      },
      {
        description: 'Money Claims - Claim Amount - Unspecified',
        status: 'approved',
        author: '124756',
        approvedBy: '39907',
        version: 2,
        valid_from: '2014-04-22T00:00:00.000+0000',
        flat_amount: {
          amount: 10000
        },
        memo_line: 'RECEIPT OF FEES - Civil issue money',
        statutory_instrument: '2015 No 576',
        si_ref_id: '1.1i',
        natural_account_code: '4481102133',
        fee_order_name: 'Civil Proceedings',
        direction: 'enhanced'
      }
    ],
    current_version: {
      description: 'Test description',
      status: 'approved',
      author: '124756',
      approvedBy: '39907',
      version: 2,
      valid_from: '2014-04-22T00:00:00.000+0000',
      flat_amount: {
        amount: 500
      },
      memo_line: 'RECEIPT OF FEES - Civil issue money',
      statutory_instrument: '2015 No 576',
      si_ref_id: '1.1i',
      natural_account_code: '4481102133',
      fee_order_name: 'Civil Proceedings',
      direction: 'enhanced'
    },
    unspecified_claim_amount: true
  }
];
