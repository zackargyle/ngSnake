
angular.module('ngSnake', [])

  .controller('snakeCtrl', function($scope, $timeout, $window) { 
    var LEFT = 1, UP = 2, RIGHT = 3, DOWN = 4,
        boardSize = 20, interval = 150,
        tempDirection, GAME_OVER;

    var snake = {direction: LEFT, parts: [{x:-1,y:-1}]};
    var fruit = {x:-1,y:-1};

    $scope.ngScores = JSON.parse(localStorage.getItem("ngScores") || "[]");
    $scope.ngScores.sort(function(a,b) {
      return b-a;
    });
    $scope.score = 0;

    $scope.setStyling = function(row, col) {
      if (GAME_OVER) 
        return {"backgroundColor":"#820303"};
      else if (fruit.x == col && fruit.y == row)
        return {"backgroundColor": "#E80505"};
      else if (snake.parts[0].x == col && snake.parts[0].y == row)
        return {"backgroundColor": "#078F00"};
      else if ($scope.board[row][col] === 1)
        return {"backgroundColor":"#0DFF00"};
      return {"backgroundColor":"#000"};
    }

    function update() {
      var newPart = angular.copy(snake.parts[0]);
      snake.direction = tempDirection;

      // Update Location
      if (tempDirection === LEFT)
          newPart.x -= 1;
      else if (tempDirection === RIGHT)
          newPart.x += 1;
      else if (tempDirection === UP)
          newPart.y -= 1
      else if (tempDirection === DOWN)
          newPart.y += 1;

      if (boardCollision(newPart) || selfCollision(newPart)) {
        return gameOver();
      } else if (newPart.x === fruit.x && newPart.y === fruit.y) {
        eatFruit();
      }

      var oldPart = snake.parts.pop();
      snake.parts.unshift(newPart);
      $scope.board[oldPart.y][oldPart.x] = 0;
      $scope.board[newPart.y][newPart.x] = 1;

      // Do it again
      $timeout(function() {
        update();
      }, interval);
    }

    function boardCollision(part) {
       if(part.x === boardSize || part.x === -1 || 
        part.y === boardSize || part.y === -1 ) {
        return true;
      }
      return false;
    }

    function selfCollision(part) {
      if ($scope.board[part.y][part.x] === 1) {
        return true;
      }
      return false;
    }

    function resetFruit() {
      var x = Math.floor(Math.random() * boardSize);
      var y = Math.floor(Math.random() * boardSize);

      if ($scope.board[y][x] === 1) {
        return resetFruit();
      }
      fruit = {x:x, y:y};
    }

    function eatFruit() {
      $scope.score++;
      
      if ($scope.score % 5 === 0) {
        interval -= 15;
      }
      var tail = angular.copy(snake.parts[snake.parts.length-1]);
      snake.parts.push(tail);
      resetFruit();
    }

    function gameOver() {
      GAME_OVER = true;
      $scope.ngScores.push($scope.score)
      $scope.ngScores.sort(function(a,b) {return b-a });
      localStorage.setItem("ngScores", JSON.stringify($scope.ngScores));

      $timeout(function() {
        GAME_OVER = false;
      },500);

      resetBoard();
    }

    function resetBoard() {
      $scope.board = [];
      for (var i = 0; i < boardSize; i++) {
        $scope.board[i] = [];
        for (var j = 0; j < boardSize; j++) {
          $scope.board[i][j] = 0;
        }
      }
    }
    resetBoard();

    $window.addEventListener("keyup", function(e) {
      if (e.keyCode == 37 && snake.direction !== RIGHT) 
        tempDirection = LEFT;
      else if (e.keyCode == 38 && snake.direction !== DOWN) 
        tempDirection = UP;
      else if (e.keyCode == 39 && snake.direction !== LEFT) 
        tempDirection = RIGHT;
      else if (e.keyCode == 40 && snake.direction !== UP) 
        tempDirection = DOWN;
    });

    $scope.startGame = function() {
      $scope.score = 0;
      snake = {direction: LEFT, parts: []};
      tempDirection = LEFT;
      fruit = {x:-1,y:-1};
      GAME_OVER = false;

      // Set up initial snake
      for (var i = 0; i < 5; i++) {
        snake.parts.push({x: 10 + i, y: 10});
      }
      resetFruit();
      update();
    }

  });