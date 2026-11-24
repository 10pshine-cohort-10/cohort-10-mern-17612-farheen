import {expect} from "chai";
import sinon from "sinon";
import {db} from "../models/index.ts";
import {register} from "../services/auth.js";

describe("signup", () => {
    afterEach(() => sinon.restore());

    it("rejects an email that is already used", async () => {
        // find_by_email chains .select("+password"), so the stub has to return something with select
        sinon.stub(db.User, "findOne").returns({select: sinon.stub().resolves({id: "u1"})});
        let err;
        try {
            await register("Ali", "a@b.com", "Abcdef1!", "Abcdef1!");
        }
        catch (e) {
            err = e;
        }
        expect(err?.status).to.equal(409);
        expect(err?.message).to.equal("This email is already used");
    });
});
