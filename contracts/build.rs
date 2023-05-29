use tequila_io::ContractMetadata;
use gmeta::Metadata;
use gear_wasm_builder::WasmBuilder;

fn main() {
    WasmBuilder::with_meta(ContractMetadata::repr()).build();
}
