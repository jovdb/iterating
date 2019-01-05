
import { initTests, startTest } from "./test";
import "./table";
import "./graph";

import "./array/tests";
import "./pipeables/tests";
import "./transducers/tests";
import "./generators/tests";
import "./callbags/tests";
import "./reduce/tests";
import "./foreach/tests";
import "./while/tests";
import "./for-of/tests";
import "./for/tests";

window.onload = () => {
	initTests();
	startTest();
};

