import { SelectOption } from "naive-ui";

export interface ProFormSelectProps {
    value: string | number;
    request?: () => Promise<SelectOption[]>;
    label: string;
    path: string;
}