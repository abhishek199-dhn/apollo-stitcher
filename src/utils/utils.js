// @flow

import moment from "moment";
import _ from "lodash";
import constants from "../utils/Constants";

class Utils {
    getTodayDateString = () => moment().format(constants.DATE_FORMAT);

    joinArray = (objValue: Array<any>, srcValue: Array<any>) => {
        if (_.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    };
}

export default Utils;
