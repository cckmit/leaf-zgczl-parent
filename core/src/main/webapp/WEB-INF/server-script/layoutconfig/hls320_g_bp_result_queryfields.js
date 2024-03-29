var override_queryfields = [
		{
			name : 'subsidy_date_from',
			queryexpression : "t1.subsidy_date between to_date(${@subsidy_date_from},'yyyy-mm-dd') and nvl(to_date(${@subsidy_date_to},'yyyy-mm-dd'),t1.subsidy_date)"
		},
		{
			name : 'subsidy_date_to',
			queryexpression : "t1.subsidy_date between nvl(to_date(${@subsidy_date_from},'yyyy-mm-dd'),t1.subsidy_date) and to_date(${@subsidy_date_to},'yyyy-mm-dd')"
		},

		{
			name : 'subsidy_amount_from',
			queryexpression : "t1.subsidy_amount >= to_char(${@subsidy_amount_from}, 'FM999999999990.00')"
		},
		{
			name : 'subsidy_amount_to',
			queryexpression : "t1.subsidy_amount <= to_char(${@subsidy_amount_to}, 'FM999999999990.00')"
		},
		{
			name : 'management_promotion',
			queryexpression : "nvl(t1.management_promotion, 'N') = ${@management_promotion}"
		}, {
			name : 'bp_name',
			queryexpression : "t1.bp_name like '%'||${@bp_name}||'%'"
		} ];

override();
