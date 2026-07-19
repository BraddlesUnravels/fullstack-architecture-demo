#!/usr/bin/env bash

set -euo pipefail

CONTAINERS=("app_ui" "app_api" "app_redis" "app_postgres")
NETWORK="app-network"
IMAGES=("fullstack-api:test" "fullstack-ui:test")

remove_container_if_exists() {
  local container_name="$1"

  if ! docker container inspect "$container_name" > /dev/null 2>&1; then
    echo "[tear-down] Container not found: ${container_name}"
    return
  fi

  docker rm --force "$container_name" > /dev/null
  echo "[tear-down] Removed container: ${container_name}"
}

remove_network_if_exists() {
  if ! docker network inspect "$NETWORK" > /dev/null 2>&1; then
    echo "[tear-down] Network not found: ${NETWORK}"
    return
  fi

  docker network rm "$NETWORK" > /dev/null
  echo "[tear-down] Removed network: ${NETWORK}"
}

remove_image_if_exists() {
  local image_name="$1"

  if ! docker image inspect "$image_name" > /dev/null 2>&1; then
    echo "[tear-down] Image not found: ${image_name}"
    return
  fi

  if docker image rm "$image_name" > /dev/null; then
    echo "[tear-down] Removed image: ${image_name}"
  else
    echo "[tear-down] Could not remove image: ${image_name}"
  fi
}

echo "[tear-down] Starting staged production cleanup"

for container_name in "${CONTAINERS[@]}"; do
  remove_container_if_exists "$container_name"
done

remove_network_if_exists

for image_name in "${IMAGES[@]}"; do
  remove_image_if_exists "$image_name"
done

echo "[tear-down] Completed staged production cleanup"
