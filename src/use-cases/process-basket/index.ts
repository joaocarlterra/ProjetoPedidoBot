import ProcessBasketCase from "./process-basket-case";
import ProcessBasketController from "./process-basket-controller";

const processBasketCase = new ProcessBasketCase()
const processBasketController = new ProcessBasketController(processBasketCase)

export default processBasketController
