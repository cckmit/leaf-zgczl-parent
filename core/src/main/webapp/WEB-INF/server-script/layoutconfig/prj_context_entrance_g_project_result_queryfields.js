var override_queryfields = [ 
{
	field : 'project_id',
	queryoperator : "="
},
{
	field : 'project_name',
	queryoperator : "like"
},
{
	name : 'creation_date_from',
	queryexpression : "e.creation_date between to_date(${@creation_date_from},'yyyy-mm-dd') and nvl(to_date(${@creation_date_to},'yyyy-mm-dd'),e.creation_date)"
},
{
	name : 'creation_date_to',
	queryexpression : "e.creation_date between nvl(to_date(${@creation_date_from},'yyyy-mm-dd'),e.creation_date) and to_date(${@creation_date_to},'yyyy-mm-dd')"
},
{
	name : 'bp_id',
	queryexpression : "exists (select 1 from prj_project_bp b where b.project_id=t1.project_id and b.bp_id=${@bp_id})"
},
{
	name : 'bp_name',
	queryexpression : "exists (select 1 from prj_project_bp_v b where b.project_id=t1.project_id and b.bp_name like ${@bp_name})"
},
{
	field : 'employee_id',
	queryoperator : "="
},
{
	field : 'lease_organization',
	queryoperator : "="
},
{
	field : 'employee_id_of_manager',
	queryoperator : "="
},
{
	field : 'division',
	queryoperator : "="
},
{
	field : 'lease_channel',
	queryoperator : "="
},
{
	field : 'document_type',
	queryoperator : "="
},
{
	field : 'project_status',
	queryoperator : "="
},
{
	field : 'search_term_1',
	queryoperator : "="
},
{
	field : 'search_term_2',
	queryoperator : "="
}


];

override();
