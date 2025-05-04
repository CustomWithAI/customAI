#!/bin/sh

set -e

# Create S3 bucket
aws --endpoint-url=http://localstack:4566 s3api create-bucket \
  --bucket my-bucket --region us-east-1

# Sync each subfolder into its corresponding S3 path
for folder in classification-1 classification-2 object-detection segmentation; do
  echo "Uploading $folder..."
  aws --endpoint-url=http://localstack:4566 s3 cp \
    /aws/$folder s3://my-bucket/datasets/$folder/ \
    --recursive --exclude "*" --include "*.jpg"
done

# Upload CORS config if needed
if [ -f /aws/cors.json ]; then
  aws --endpoint-url=http://localstack:4566 s3api put-bucket-cors \
    --bucket my-bucket \
    --cors-configuration file:///aws/cors.json
fi

# Optional: show summary
aws --endpoint-url=http://localstack:4566 s3 ls s3://my-bucket --recursive --human-readable --summarize
