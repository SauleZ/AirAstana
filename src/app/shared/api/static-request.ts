import {MainSearchRequest} from '../models/search (itinerary)/main-search-request';

export class StaticRequest {

    public static readonly SEARCH_CALENDAR_BODY = {
        isResident: false,
        regionCode: 'KAZ',
        languageCode: 'EN',
        cabinType: 'Economy',
        itineraries: [
            {
                originLocationCode: 'ALA',
                destinationLocationCode: 'DXB',
                departureDateTime: '2021-09-17'
            },
            {
                originLocationCode: 'DXB',
                destinationLocationCode: 'ALA',
                departureDateTime: '2021-09-26'
            }
        ],
        passengers: [
            {
                    passengerTypeCode: 'ADT'
            },
            {
                    passengerTypeCode: 'CHD'
            }
        ]
    };

    public static readonly SEARCH_INBOUNDS_BODY = {
        isResident: true,
        regionCode: 'KAZ',
        languageCode: 'EN',
        cabinType: 'Economy',
        passengers: [
            {
                passengerTypeCode: 'ADT'
            },
            {
                passengerTypeCode: 'CHD'
            }
        ],
        max: 1,
        itineraries: [
            {
                originLocationCode: 'NQZ',
                destinationLocationCode: 'ALA',
                departureDateTime: '2020-08-01'
            }
        ]
    };
    public static readonly SEARCH_BOUNDS_BODY = {
        isResident: true,
        regionCode: 'KAZ',
        languageCode: 'EN',
        cabinType: 'Economy',
        passengers: [
            {
                passengerTypeCode: 'ADT'
            },
            {
                passengerTypeCode: 'CHD'
            }
        ],
        max: 1,
        itineraries: [
            {
                originLocationCode: 'ALA',
                destinationLocationCode: 'NQZ',
                departureDateTime: '2020-08-07'
            }, {
                originLocationCode: 'NQZ',
                destinationLocationCode: 'ALA',
                departureDateTime: '2020-09-10'
            }
        ],
        filtration: {
            durationFrom: 0,
            durationTo: 0,
            arrivalFrom: '2020-09-10T00:00:00.000Z',
            arrivalTo: '2020-08-07T00:00:00.000Z',
            departureFrom: '2020-09-10T00:00:00.000Z',
            departureTo: '2020-08-07T00:00:00.000Z',
            withoutStops: false
        },
        sorting: {
            sort_by: 'duration',
            order_by: 'desc'
        }
    };

    public static readonly SEARCH_BOUNDS_BODY_2 = {
        isResident: false,
        regionCode: 'KAZ',
        languageCode: 'EN',
        cabinType: 'Economy',
        passengers: [
            {
                passengerTypeCode: 'ADT'
            },
            {
                passengerTypeCode: 'CHD'
            }
        ],
        itineraries: [
            {
                originLocationCode: 'ALA',
                destinationLocationCode: 'DXB',
                departureDateTime: '2021-09-17'
            },
            {
                originLocationCode: 'DXB',
                destinationLocationCode: 'ALA',
                departureDateTime: '2021-09-26'
            }
        ]
        // filtration: {
        //     durationFrom: 0,
        //     durationTo: 100000,
        //     arrivalFrom: '2020-09-29T00:00:00',
        //     arrivalTo: '2020-09-29T00:00:00',
        //     departureFrom: '2020-09-12T00:00:00',
        //     departureTo: '2020-09-12T00:00:00',
        //     withoutStops: false
        // },
        // sorting: {
        //     sort_by: 'duration',
        //     order_by: 'desc'
        // }
    };

    public static readonly SEARCH_OUTBOUNDS_BODY = {
        isResident: true,
        regionCode: 'KAZ',
        languageCode: 'EN',
        cabinType: 'Economy',
        passengers: [
            {
                passengerTypeCode: 'ADT'
            }
        ],
        max: 1,
        itineraries: [
            {
                originLocationCode: 'ALA',
                destinationLocationCode: 'NQZ',
                departureDateTime: '2020-09-01'
            }
        ]
    };

    public static readonly BOOKING_ORDER = {
        offers: [
            {
                bounds: [
                    {
                        flights: [
                            {
                                item: {
                                    bookingClass: 'Y'
                                },
                                details: {
                                    marketingAirlineCode: 'KC',
                                    marketingFlightNumber: '622',
                                    departure: {
                                        locationCode: 'NQZ',
                                        dateTime: '2020-07-10'
                                    },
                                    arrival: {
                                        locationCode: 'ALA'
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        passengers: [
            {
                personality: {
                    firstName: 'Temirlan',
                    lastName: 'Khamidulin',
                    title: 'mr',
                    dateOfBirth: '1997-12-25',
                    gender: 'male'
                },
                contacts: [
                    {
                        address: 'tima.kh.97@gmail.com',
                    },
                    {
                        number: '77012323080'
                    }
                ]
            }
        ]
    }

    public static readonly ORDERS = {
        AIRBUS_A321_1: {
            code: 'MKWOR6',
            lastName: 'TESTFIRST',
            description: 'airbus a321'
        },
        AIRBUS_A321_2: {
            code: 'MKWTOS',
            lastName: 'TESTSECOND',
            description: 'airbus a321'
        },
        EMBRAER_190: {
            code: 'MKWNI7',
            lastName: 'TESTTHIRD',
            description: 'EMBRAER 190'
        },
        BOEING_757: {
            code: 'MKYLTN',
            lastName: 'TESTFOURTH',
            description: 'BOEING 757'
        },
        AIRBUS_A321NEO: {
            code: 'MKYGFA',
            lastName: 'TESTINGFIFTH',
            description: 'AIRBUS A321NEO'
        },
        AIRBUS_A320: {
            code: 'MKYIV3',
            lastName: 'TESTINGSIXTH',
            description: 'AIRBUS A320'
        },
        AIRBUS_A320_FULL_ECONOMY: {
            code: 'NEUPAS',
            lastName: 'TESTFOURTH',
            description: 'Airbus 320 full economy'
        }
    };

    public static readonly ORDERS_2 = {
        BOEING_767: {
            code: 'NEIMXZ',
            lastName: 'TESTFIRST',
            description: 'airbus a321'
        },
        BOEING_757: {
            code: 'NEIRH2',
            lastName: 'TESTSECOND',
            description: 'airbus a321'
        },
        EMBRAER_190: {
            code: 'NEK3XS',
            lastName: 'TESTTHIRD',
            description: 'EMBRAER 190'
        },
        AIRBUS_A321NEO: {
            code: 'NEKBUK',
            lastName: 'TESTINGFIFTH',
            description: 'BOEING 757'
        },
        AIRBUS_A320: {
            code: 'NEKJHM',
            lastName: 'TESTINGSIXTH',
            description: 'AIRBUS A320'
        }
    };

    public static readonly ORDERS_3 = {
        AIRBUS_A321: {
            code: 'NVNUHX',
            lastName: 'ECONOMYFIRST',
            description: 'airbus a321'
        }
    };

}
