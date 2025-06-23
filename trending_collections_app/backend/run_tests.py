#!/usr/bin/env python3
import sys
import os
import pytest

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == '__main__':
    # Run tests using pytest
    exit_code = pytest.main(["-v"])
    
    # Exit with the pytest exit code
    sys.exit(exit_code)