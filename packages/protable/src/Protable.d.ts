import { PaginationProps } from "naive-ui";

type ValueType = 'select' | 'text' | 'date' | 'dateTime' | 'time' | 'timeRange';

declare module 'naive-ui' {
    export interface DataTableColumns {
        valueType?: ValueType | null;
        hideInSearch?: boolean;
        hideInForm?: boolean;
        hideInTable?: boolean;
    }
}

// export interface ProtableColumn extends DataTableColumn {
//     valueType?: 'select' | 'text' | 'date';
//     hideInSearch?: boolean;
//     hideInForm?: boolean;
//     hideInTable?: boolean;
// }

export interface ProtableInstance<T> {
    reload: () => void;
    setColumns: (columns: ProtableColumns<T>) => void;
    setSearch: (search: any) => void;
    setForm: (form: any) => void;
    setPagination: (pagination: any) => void;
    setTableData: (tableData: T[]) => void;
    setLoading: (loading: boolean) => void;
    setSelectedRowKeys: (selectedRowKeys: string[]) => void;
    setSelectedRows: (selectedRows: T[]) => void;
    setRowSelection: (rowSelection: any) => void;
    setColumnsState: (state: any) => void;
}

export interface SearchConfig {
    formItems: any[];
    formRules: any[];
    formModel: any;
    labelWidth: string | 'auto';
    labelAlign: 'left' | 'right';
    labelPlacement: 'left' | 'right' | 'top' | 'bottom';
    size?: 'small' | 'medium' | 'large';
    showAdvancedButton?: boolean;
    showResetButton?: boolean;
    submitButtonText?: string;
    resetButtonText?: string;
}

export interface ProtableProps {
    columns: ProtableColumns<T>;
    pageTitle: string;
    loading?: boolean;
    dataSource?: any[];
    pagination?: false | PaginationProps;
    searchConfig?: SearchConfig;
    rowKey: any;
    createButtonText?: string;
    showCreate: boolean;
}

export interface ProtableEmits {
    (e: 'loadData', page: number): void
    (e: 'create'): void
    (e: 'update:pageSize', pageSize: number): void
    (e: 'update:page', page: number): void
    (e: 'update:checked', keys: Array<string | number>, rows: object[], meta: { row: object | undefined, actions: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' }): void
}
