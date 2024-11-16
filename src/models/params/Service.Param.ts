export interface GetServicesParam {
	with_deleted?: boolean;
	with_relations?: boolean;
}

export interface GetServiceParam {
	with_deleted?: boolean;
	with_relations?: boolean;
}

export interface DeleteServiceParam {
	discontinue_service?: boolean;
}

export interface RecoverServiceParam {
	continue_service?: boolean;
}
