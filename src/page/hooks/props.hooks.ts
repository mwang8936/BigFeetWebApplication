export interface QueryProp {
	gettable: boolean;
	staleTime?: number; // In milliseconds
	refetchInterval?: number; // In milliseconds
	refetchIntervalInBackground?: boolean;
}

export interface MutationProp {
	setLoading?: (loading: boolean) => void;
	setError?: (error: string) => void;
}
