const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

const GRID_SQUARE_SIZE = 20;


const ROWS = CANVAS_HEIGHT / GRID_SQUARE_SIZE;
const COLS = CANVAS_WIDTH / GRID_SQUARE_SIZE;

const COLORS = [0, 255]; // 0 == dead, 1 == alive


let current_grid;

let old_grid


const generate_2d = (rows, cols) => Array.from(Array(rows), () => Array(cols).fill(0))

const count_occ = (arr, val) => {

    let counter = 0;
    for (const check of arr) {
        if (check == val) {
            counter++;
        }
    }
    return counter;
}

const calculate_next_state = (current_state, neighbours) => {
    let living_neighbours = count_occ(neighbours, 1);

    if (current_state) {
        if (living_neighbours > 2) return 0; // 1: Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        if (living_neighbours > 3) return 0; // 3: Any live cell with more than three live neighbours dies, as if by overpopulation

        return 1; // 2: Any live cell with two or three live neighbours lives on to the next generation.

    } else {

        if (living_neighbours == 3) return 1; //4: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    }

    return 0;
}

const get_updated_grid = (old_grid, rows, cols) => {
    let res = generate_2d(rows, cols)
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            res[y][x] = calculate_next_state(old_grid[y][x], get_neighbours(old_grid, x, y))
        }
    }

    return res
}


const get_neighbours = (grid, curr_x, curr_y) => {

    let neighbours = []
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i == 0 && j == 0) continue
            if (grid[curr_y + i] !== undefined)
                if (grid[curr_y + i][curr_x + j] !== undefined) {
                    neighbours.push(grid[curr_y + i][curr_x + j])
                }
        }
    }

    return neighbours

}

const render_grid = (grid, rows, cols) => {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            fill(COLORS[grid[y][x]])
            rect(x * GRID_SQUARE_SIZE, y * GRID_SQUARE_SIZE, GRID_SQUARE_SIZE, GRID_SQUARE_SIZE);
        }
    }
}


function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    current_grid = generate_2d(ROWS, COLS);
    current_grid.forEach((el, index) => el.forEach((el2, in2) => current_grid[index][in2] = floor(random(2))))

    frameRate(10)
}


function draw() {
    old_grid = [...current_grid]
    current_grid = get_updated_grid(old_grid, ROWS, COLS)
    background(0)
    render_grid(current_grid, ROWS, COLS)
}
