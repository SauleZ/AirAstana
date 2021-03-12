/**
 * Deck dimensions are used as a reference to display the entire aircraft or
 * to the section associated to the requested cabin (or set of cabins)
 */
export class SeatmapDeckDimensions {

    /**
     * Width (y-axis) of the deck.The value of the width is considered for display of y coordinate.
     * y coordinate takes the value from 0 to the value of width.
     */
    public width: number;

    /**
     * Length (x-axis) of the deck.The value of the length is considered for display of x coordinate.
     * x coordinate takes the value from 0 to the value of length.
     */
    public length: number;

    /**
     * Start x coordinate of the wings.The wings display starts relatively to the length.
     */
    public startWingsX: number;

    /**
     * End x coordinate of the wings.The wings display ends relatively to the length.
     */
    public endWingsX: number;

    /**
     * X coordinate of the exit rows.The exit rows are displayed relatively to the length.
     */
    public exitRowsX: number[];


    constructor() {}

}
