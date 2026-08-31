#!/usr/bin/env bash
# Helper script to create branch, commit and push changes to origin
BRANCH=prepare/submission
git checkout -b $BRANCH
git add .
git commit -m "Prepare submission: serverless, security, k8s manifests, review-service, docs"
git push -u origin $BRANCH
echo "Branch pushed: $BRANCH"
