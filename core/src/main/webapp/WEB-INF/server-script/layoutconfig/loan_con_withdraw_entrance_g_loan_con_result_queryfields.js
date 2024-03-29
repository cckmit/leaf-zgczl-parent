var override_queryfields = [
		{
			name : 'wfl_mdf_status_flag',
			queryexpression : "${@wfl_mdf_status_flag}=&apos;Y&apos; and nvl(tlc.LOAN_CON_WFL_STATUS,&apos;WFL_NEW&apos;) not in(&apos;WFL_APPROVING&apos;,&apos;WFL_APPROVED&apos;) "
		},
		{
			name : 'loan_con_type_detail',
			queryexpression : 'T1.loan_con_type_detail=${@loan_con_type_detail}'
		},
		{
			field : 'loan_contract_id',
			queryoperator : '='
		},
		{
			name : 'loan_contract_number',
			queryexpression : "t1.loan_contract_number like '%'||${@loan_contract_number}||'%'"
		},
		{
			name : 'loan_contract_name',
			queryexpression : "t1.loan_contract_name like '%'||${@loan_contract_name}||'%'"
		},
		{
			name : 'loan_con_bp',
			queryexpression : "T1.loan_con_bp=${@loan_con_bp}"
		},
		{
			name : 'loan_con_bp_n',
			queryexpression : "t1.loan_con_bp_code like ${@loan_con_bp_n}"
		},
		{
			name : 'bank_branch_bp_id_n',
			queryexpression : "t1.loan_con_bp_n like '%'||${@bank_branch_bp_id_n}||'%'"
		},
		{
			name : 'loan_date_from',
			queryexpression : "T1.loan_date_from>=trunc(to_date(${@loan_date_from},'yyyy-mm-dd'))"
		},
		{
			name : 'loan_date_to',
			queryexpression : "trunc(T1.loan_date_to)<=to_date(${@loan_date_to},'yyyy-mm-dd')"
		},
		{
			name : 'loan_con_wfl_status',
			queryexpression : "nvl(t1.loan_con_wfl_status,'WFL_NEW')=${@loan_con_wfl_status}"
		},
		{
			name : 'status_check_flag',
			queryexpression : "${@status_check_flag}='Y' and t1.data_class='NORMAL' and nvl(t1.loan_con_wfl_status,'WFL_NEW')='WFL_APPROVED' and nvl(t1.loan_contract_status,'NEW') IN ('REVIEWED') " 
		}

		 ];

override();
