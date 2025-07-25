#!/bin/sh
export TEST=$(aws ssm get-parameter --name "/devconzero/env/TEST" --with-decryption --query "Parameter.Value" --output text --region us-east-1)

exec "$@"
# This script retrieves a parameter from AWS SSM and exports it as an environment variable.
# It then executes the command passed to the script.