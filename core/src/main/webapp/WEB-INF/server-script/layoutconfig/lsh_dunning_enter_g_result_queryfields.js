var override_queryfields = [
{
	name:'lease_channel_desc',
	queryexpression:"t1.lease_channel = (select ch.lease_channel from hls_lease_channel ch where ch.description = ${@lease_channel_desc})"
},
{
	name:'project_number',
	queryexpression:"t1.project_id = (select t.project_id from prj_project t where t.project_number = ${@project_number})"
},
{
	name:'bp_name',
	queryexpression:"t1.bp_id_tenant = (select t.bp_id from HLS_BP_MASTER_V t where t.bp_name = ${@bp_name})"
},
{
	name:'bp_code',
	queryexpression:"t1.bp_id_tenant = (select t.bp_id from HLS_BP_MASTER_V t where t.bp_code = ${@bp_code})"
},
{
	name : 'lease_start_date_from',
	queryexpression : "t1.lease_start_date between to_date(${@lease_start_date_from},'yyyy-mm-dd') and nvl(to_date(${@lease_start_date_to},'yyyy-mm-dd'),t1.lease_start_date)"
},
{
	name : 'lease_start_date_to',
	queryexpression : "t1.lease_start_date between nvl(to_date(${@lease_start_date_from},'yyyy-mm-dd'),t1.lease_start_date) and to_date(${@lease_start_date_to},'yyyy-mm-dd')"
},
{
	name : 'BP_ID',
	queryexpression : "t1.BP_ID_TENANT = ${@bp_id}"
},
{
	name : 'bp_id_tenant',
	queryexpression:"t1.bp_id_tenant = (select t.bp_id from HLS_BP_MASTER_V t where t.bp_name = ${@bp_id_tenant})"
},
{
	name : 'project_id',
	queryexpression:"t1.project_id = ${@project_id}"
},
{
	name : 'overdue_times_from',
	queryexpression:"t1.overdue_times between nvl(${@overdue_times_from},${@overdue_times_to}) and nvl(${@overdue_times_to},${@overdue_times_from})"
},
{
	name : 'overdue_times_to',
	queryexpression:"t1.overdue_times between nvl(${@overdue_times_from},${@overdue_times_to}) and nvl(${@overdue_times_to},${@overdue_times_from})"
},
{
	name : 'division',
	queryexpression:"t1.division  = ${@division}"
},
{
	name : 'division_not',
	queryexpression:"t1.division not in ${:@division_not}"
}

];

override();
