export function isColliding(rectA, rectB) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  );
}

export function resolvePlatformCollision(player, platform) {
  const playerBottom = player.y + player.height;
  const previousBottom = player.previousY + player.height;

  const isFalling = player.velocityY >= 0;
  const wasAbovePlatform = previousBottom <= platform.y;
  const isWithinPlatformX =
    player.x + player.width > platform.x &&
    player.x < platform.x + platform.width;

  if (isFalling && wasAbovePlatform && isWithinPlatformX && playerBottom >= platform.y) {
    player.y = platform.y - player.height;
    player.velocityY = 0;
    player.isOnGround = true;
    return true;
  }

  return false;
}