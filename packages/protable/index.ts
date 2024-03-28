import { App } from "vue";
import Protable from "./src/Protable.vue";

Protable.install = (app: App) => {
    app.component(Protable.name, Protable);
}

export default Protable;
export type { ProtableProps, ProtableColumn } from './src/Protable';
