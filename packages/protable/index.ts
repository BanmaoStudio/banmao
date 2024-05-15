import { App } from "vue";
import Protable from "./src/Protable.vue";

Protable.install = (app: App) => {
    app.component(Protable.name || 'Protable', Protable);
}

export default Protable;
export type { ProtableProps, ProtableColumns } from './src/types/Protable';
