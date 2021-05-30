"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUsers1622348668437 = void 0;
class MockUsers1622348668437 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
        insert into UserAccount (id, username, email, password, "createdAt", "updatedAt") values (1, 'sbauldry0', 'ctrewett0@unicef.org', 'jhZk91W5W', '4/18/2021', '7/22/2020');
insert into UserAccount (id, username, email, password, "createdAt", "updatedAt") values (2, 'gduiguid1', 'asallnow1@dell.com', 'U58IqmAs', '3/2/2021', '8/7/2020');
insert into UserAccount (id, username, email, password, "createdAt", "updatedAt") values (3, 'dwrey2', 'sportress2@google.com.au', 'MjoXnUBNnE', '1/23/2021', '10/5/2020');
insert into UserAccount (id, username, email, password, "createdAt", "updatedAt") values (4, 'hwebley3', 'whauxby3@live.com', 'aclMGjnKB4jC', '12/2/2020', '5/7/2021');
insert into UserAccount (id, username, email, password, "createdAt", "updatedAt") values (5, 'lscourgie4', 'kkerwick4@pen.io', '6slgst6', '6/28/2020', '3/13/2021');
insert into UserAccount (id, username, email, password, "createdAt", "updatedAt") values (6, 'hbrundall5', 'teaglestone5@tmall.com', 'hgmvqTD', '11/10/2020', '11/26/2020');
        `);
        });
    }
    down(_) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.MockUsers1622348668437 = MockUsers1622348668437;
//# sourceMappingURL=1622348668437-MockUsers.js.map