import icClear from '@iconify/icons-ic/clear';
import icDone from '@iconify/icons-ic/done';
import icFaTenge from '@iconify/icons-fa-solid/tenge';

export class FakeDb {

    private icClear = icClear;
    private icDone = icDone;
    private icFaTenge = icFaTenge;

    public static readonly RATES = [
        {
            title: '93 000',
            subtitle: 'Basic',
            line: 'line-green',
            lineWord: null,
            content: [
                {
                    icon: icClear,
                    item: 'No baggage'
                },
                {
                    icon: icDone,
                    item: 'Hand luggage 1 x 8kg'
                },
                {
                    icon: icClear,
                    item: 'NC points - No'
                },
                {
                    icon: icClear,
                    item: 'No Rebooking'
                },
                {
                    icon: icClear,
                    item: 'No Refund'
                },
                {
                    icon: icClear,
                    item: 'Business loungde No'
                }
            ]
        },
        {
            title: '128 000',
            subtitle: 'Classic',
            line: 'line-red',
            lineWord: 'Last 3 seats',
            content: [
                {
                    icon: icDone,
                    item: 'Baggage 1 x 23kg'
                },
                {
                    icon: icDone,
                    item: 'Hand luggage 1 x 8kg'
                },
                {
                    icon: icDone,
                    item: 'NC points 100%'
                },
                {
                    icon: icFaTenge,
                    item: 'Rebooking For a fee'
                },
                {
                    icon: icFaTenge,
                    item: 'Refund For a fee'
                },
                {
                    icon: icClear,
                    item: 'Business loungde No'
                }
            ]
        },
        {
            title: '150 000',
            subtitle: 'Plus',
            line: 'line-orange',
            lineWord: null,
            content: [
                {
                    icon: icDone,
                    item: 'Baggage 1 x 23kg'
                },
                {
                    icon: icDone,
                    item: 'Hand luggage 1 x 8kg'
                },
                {
                    icon: icDone,
                    item: 'NC points 150%'
                },
                {
                    icon: icFaTenge,
                    item: 'Rebooking For a fee'
                },
                {
                    icon: icFaTenge,
                    item: 'Refund For a fee'
                },
                {
                    icon: icClear,
                    item: 'Business loungde No'
                }
            ]
        },
        {
            title: '190 000',
            subtitle: 'Flex',
            line: 'line-black',
            lineWord: null,
            content: [
                {
                    icon: icDone,
                    item: 'Baggage 1 x 23kg'
                },
                {
                    icon: icDone,
                    item: 'Hand luggage 1 x 10kg'
                },
                {
                    icon: icDone,
                    item: 'NC points 200%'
                },
                {
                    icon: icDone,
                    item: 'Rebooking'
                },
                {
                    icon: icDone,
                    item: 'Refund'
                },
                {
                    icon: icDone,
                    item: 'Business loungde No'
                }
            ]
        }
    ];

    public static readonly FLIGHTS_INFO: any = [
        {
            labelAbove: '09 Jul, Mon',
            labelBelow: 'from 94 500 т',
            values: [
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                },
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                }
            ]
        },
        {
            labelAbove: '10 Jul, Tue',
            labelBelow: 'from 94 500 т',
            values: [
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                },
                {
                    distance: [
                        {time: '12:00', place: 'TSE', additionalInfo: null},
                        {time: '4h 10m,', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    price: '93 000',
                    rates: FakeDb.RATES
                }
            ]
        },
        {
            labelAbove: '11 Jul, Wed',
            labelBelow: 'from 94 500 т',
            values: [
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                },
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                }
            ]
        },
        {
            labelAbove: '12 Jul, Thu',
            labelBelow: 'from 94 500 т',
            values: [
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                },
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                }
            ]
        },
        {
            labelAbove: '13 Jul, Fri',
            labelBelow: 'from 94 500 т',
            values: [
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                },
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                }
            ]
        },
        {
            labelAbove: '14 Jul, Sat',
            labelBelow: 'from 94 500 т',
            values: [
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                },
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                }
            ]
        },
        {
            labelAbove: '15 Jul, Sun',
            labelBelow: 'from 94 500 т',
            values: [
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                },
                {
                    timeline: [
                        {time: '12:00', additionalInfo: null},
                        {time: '4h 10m', additionalInfo: '1 stop'},
                        {time: '16:10', additionalInfo: '+1 day'}
                    ],
                    place: ['TSE', 'MOW', 'LED'],
                    price: '93 000',
                    rates: FakeDb.RATES
                }
            ]
        }
    ];

    public static readonly FLIGHTS: any = [
        {
            type: 'Departure',
            from: 'Almaty',
            fromCode: 'ALA',
            to: 'Dubai',
            toCode: 'DXB',
            info: FakeDb.FLIGHTS_INFO
        },
        {
            type: 'Return',
            from: 'Dubai',
            to: 'Almaty',
            info: FakeDb.FLIGHTS_INFO
        },
    ];



}
