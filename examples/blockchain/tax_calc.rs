pub fn calculate_sst(price: f64) -> f64 {
    // High precision calculation for Malaysia SST
    price * 0.08
}

fn main() {
    let result = calculate_sst(4999.0);
    println!("SST Result: {}", result);
}
