import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import Ajv, { ErrorObject } from "ajv";
import { challengeRuleSchema } from "./rulesjson.schema";

@Injectable()
export class RulesJsonPipe implements PipeTransform {
    private ajv = new Ajv({ allErrors: true, strict: false });
    private validate;

    constructor() {
        this.validate = this.ajv.compile(challengeRuleSchema);
    }

    transform(value: any) {
        if (!this.validate(value)) {
            const msgs = (this.validate.errors as ErrorObject[]).map(e => {
                const path = e.instancePath || e.schemaPath;
                return `${path}: ${e.message}`;
            });
            throw new BadRequestException({ code: 'RULES_INVALID', errors: msgs });
        }
        return value;
    }
}