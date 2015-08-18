import BaseController from "../../base/base.controller";
import PlaygroundStore from "./playground.store";

class PlaygroundController extends BaseController {
    
    initialize() {
        console.log("initialize");

        this.mystore = new PlaygroundStore();
        this.mystore.registerGetCallback(this.dataDownloaded);

        this.mystore.dispatchGetAction();
    }

    dataDownloaded (data) {
        console.log(data);
    }
}

export default PlaygroundController;
