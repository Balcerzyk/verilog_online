#include <memory>
#include <systemc.h>
#include <verilated.h>
#if VM_TRACE
    #include <verilated_vcd_sc.h>
#endif
#include <sys/stat.h>  // mkdir

#include "Vtop.h"

int sc_main(int argc, char* argv[]) {
    if (false && argc && argv) {}

    Verilated::mkdir("logs");
    Verilated::debug(0);
    Verilated::randReset(2);
    #if VM_TRACE
        Verilated::traceEverOn(true);
    #endif
    Verilated::commandArgs(argc, argv);

    ios::sync_with_stdio();



    sc_signal<bool> reset_l;

    const std::unique_ptr<Vtop> top{new Vtop{"top"}};



    top->reset_l(reset_l);

    sc_start(1, SC_NS);

#if VM_TRACE
    VerilatedVcdSc* tfp = nullptr;
    const char* flag = Verilated::commandArgsPlusMatch("trace");
    if (flag && 0 == strcmp(flag, "+trace")) {
        cout << "Enabling waves into logs/vlt_dump.vcd...\n";
        tfp = new VerilatedVcdSc;
        top->trace(tfp, 99);  // Trace 99 levels of hierarchy
        Verilated::mkdir("logs");
        tfp->open("logs/vlt_dump.vcd");
    }
#endif

while (!Verilated::gotFinish()) {
    #if VM_TRACE
        if (tfp) 
            tfp->flush();
    #endif

    if (sc_time_stamp() > sc_time(1, SC_NS) && sc_time_stamp() < sc_time(10, SC_NS)) {
        reset_l = !1;  // Assert reset
    } else {
        reset_l = !0;  // Deassert reset
    }

    sc_start(1, SC_NS);
}

    top->final();

    #if VM_TRACE
        if (tfp) {
        tfp->close();
        tfp = nullptr;
    }
#endif

#if VM_COVERAGE
    Verilated::mkdir("logs");
    VerilatedCov::write("logs/coverage.dat");
#endif

    return 0;
}