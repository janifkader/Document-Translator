#include <unistd.h>

// This program is intended to be run like
//   ./funny <(./funny)
// So the outer one sees argc==2, the inner one sees argc==1.
// The inner one has exit code 1.
// The outer one has exit code 0, and also terminates later.
// This difference tests your wait-for-correct-child logic.

int main(int argc, char **argv) {
  if (argc == 1) {
    return 1;
  } else {
    sleep(1);
    return 0;
  }
}
