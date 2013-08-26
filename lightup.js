$(document).ready(function() {
  var input = ''
  var height, width;

  var checkInput = function() {
    return input && input != '';
  };

  var drawPuzzle = function() {
    var formatInput = input.split('\n');
    var puzzle = $('#puzzle');

    width = parseInt(formatInput[0]);
    height = parseInt(formatInput[1]);

    puzzle.empty();
    for(var i = 0; i < height; i++) {
      puzzle.append('<tr class="puzzle_row" row=' + (height - i) + '></tr>');
    }

    for(var i = 1; i <= height; i++) {
      var row = $('[row=' + i + ']');
      for(var j = 1; j <= width; j++) {
        row.append('<td class="puzzle_cell" col=' + j + '></td>');
      }
    }

    addBlackCells(formatInput);
    addBulbs();
    addLitCells();

    $('.puzzle_cell').click(function(evt) {
      addBulb($(evt.target));
    });
  }

  var addBlackCells = function(formatInput) {
    var lineFormat, x, y, adjacentNum, i, cell;

    for(i = 2; i < formatInput.length; i++) {
      lineFormat = formatInput[i].split(' ');
      x = lineFormat[0];
      y = lineFormat[1];
      adjacentNum = lineFormat[2];

      cell = getCell(x,y);
      cell.addClass('black_cell');
      if(adjacentNum != 5) {
        cell.append('<p class="cell_number">' + adjacentNum + '</p>');
      }
    }
  };

  var addBulbs = function() {
    var solution, bulbX, bulbY, lineFormat;

    solution = $('#light_up_output').val().split('\n');
    for(var i = 1; i < solution.length; i++) {
      lineFormat = solution[i].split(' ');
      x = lineFormat[0];
      y = lineFormat[1];

      cell = getCell(x,y);
      cell.addClass('bulb');
    }
  };

  var addBulb = function(elem) {
    if(!elem.hasClass('black_cell')) {
      if(elem.hasClass('bulb')) {
        elem.removeClass('bulb');
        clearLitCells();
      } else {
        elem.addClass('bulb');
      }
      addLitCells();
    }
  }

  var addLitCells = function() {
    var x,y;
    $('.bulb').each(function(idx, bulb) {
      x = parseInt($(bulb).attr('col'));
      y = parseInt($(bulb).parent().attr('row'));
      lightCellsFromIter(x, y, function(p_x, p_y) { return {x:p_x+1, y:p_y }; });
      lightCellsFromIter(x, y, function(p_x, p_y) { return {x:p_x-1, y:p_y }; });
      lightCellsFromIter(x, y, function(p_x, p_y) { return {x:p_x, y:p_y+1 }; });
      lightCellsFromIter(x, y, function(p_x, p_y) { return {x:p_x, y:p_y-1 }; });
    });
  }

  var clearLitCells = function() {
    var cell;
    for(var x = 1; x <= width; x++) {
      for(var y = 1; y <= height; y++) {
        cell = getCell(x,y);
        cell.removeClass('lit_cell');
      }
    }
  }

  var lightCellIfValid = function(x, y) {
    var cell = getCell(x,y);
    if(cell && !cell.hasClass('black_cell')) {
      cell.addClass('lit_cell');
      return true;
    } else {
      return false;
    }
  }

  var lightCellsFromIter = function(x, y, iter) {
    if(lightCellIfValid(x,y)) {
      var xyPair = iter(x,y);
      lightCellsFromIter(xyPair.x, xyPair.y, iter);
    }
  }

  var getCell = function(x, y) {
    var cell = $('[row=' + y + '] [col=' + x + ']');
    return !cell || cell.length == 0 ? undefined : cell;
  };

  $('#submit_light_up').click(function() {
    input = $('#light_up_input').val();
    if(checkInput()) {
      drawPuzzle();
    } else {

    }
  });
});