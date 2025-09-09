export const challengeRuleSchema = {
    $id: 'challenge.rules.v1',
    type: 'object',
    required: ['schema', 'version', 'timezonePolicy', 'windows', 'recurrence', 'points', 'requiresPhoto'],
    properties: {
        schema: { const: 'challenge.rules' },
        version: { const: 1 },
        timezonePolicy: { enum: ['user', 'challenge'] },
        graceMinutes: { type: 'integer', minimun: 0, default: 0 },
        windows: {
            type: 'array',
            minItems: 1,
            items: {
                type: 'object',
                required: ['start', 'end'],
                properties: {
                    start: { type: 'string', pattern: '^\\d{2}:\\d{2}$' },
                    end: { type: 'string', pattern: '^\\d{2}:\\d{2}$' }
                },
                additionalProperties: false
            }
        },
        recurrence: {
            type: 'object',
            required: ['type', 'rrule'],
            properties: {
                type: { enum: ['weekly'] },
                rrule: { type: 'string', minLength: 5 }
            },
            additionalProperties: false
        },
        points: {
            type: 'object',
            required: ['weekday', 'weekend'],
            properties: {
                weekday: { type: 'integer', minimun: 0 },
                weekend: { type: 'integer', minimun: 0 }
            },
            additionalProperties: false
        },
        requiresPhoto: { type: 'boolean' }
    },
    additionalProperties: false
} as const;