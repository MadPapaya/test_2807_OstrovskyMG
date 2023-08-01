const form = document.querySelector('form')
const formInput = document.querySelector('form input')
const segment = document.querySelector('.segment')
const freeBlocksText = document.querySelector('h4 span')
const setOrderBtn = document.querySelector('main > button')

const MAX_LENGTH = 100
let currentLength = 0
let currentBlockIndex = 1
let freeBlocks = [{from: 0, to: MAX_LENGTH - 1}]

form.addEventListener('submit', onSubmit)
setOrderBtn.addEventListener('click', orderBlocks)
formInput.setAttribute('max', String(MAX_LENGTH))
document.querySelector('h4 span:last-child').innerHTML = String(MAX_LENGTH)

function updateFreeBlocks() {
  freeBlocks = []
  let arrIndex = 0;
  let lastClass = segment.children[0].classList.contains('occupied') ? 'occupied' : 'free';
  let startIndex = -1;
  [...segment.children].forEach((item, index) => {
    if (!item.classList.contains('occupied')) {
        freeBlocks[arrIndex] = {from: startIndex + 1, to: index}
        lastClass = 'free'
    } else {
      if (lastClass === 'free') {
        arrIndex += 1
      }
      lastClass = 'occupied'
      startIndex = index
    }
  })

  freeBlocksText.innerHTML = currentLength
}

function orderBlocks() {
  const blocksMap = {}
  const occupiedBlocks = document.querySelectorAll('.segment div.occupied')

  if (occupiedBlocks.length) {
    const freeBlocks = document.querySelectorAll('.segment div:not(.occupied)')

    occupiedBlocks.forEach(block => {
      if (!blocksMap[block.classList[0]]?.length) {
        blocksMap[block.classList[0]] = []
      }

      blocksMap[block.classList[0]].push(block)
    })

    const blocksArr = [...Object.values(blocksMap)]
    blocksArr.forEach(block => {
      segment.append(...block);
    })
    segment.append(...freeBlocks);
    updateFreeBlocks()
  }
}

function onSubmit(e) {
  e.preventDefault()
  const blockLength = Number(formInput.value)
  if ((MAX_LENGTH - currentLength) >= blockLength) {
    let newBlock = {arrIndex: null, index: null}
    let blockBgColor
    do {
      blockBgColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    } while (blockBgColor.length !== 7)
    for (const [index, freeBlock] of freeBlocks.entries()) {
      if (freeBlock.to - freeBlock.from === blockLength - 1) {
        newBlock.index = freeBlock.from
        newBlock.arrIndex = index
        break;
      }
      if (newBlock.index === null && freeBlock.to - freeBlock.from >= blockLength - 1) {
        newBlock.index = freeBlock.from
        newBlock.arrIndex = index
      }
    }
    if (newBlock.index !== null) {
      for (let i = freeBlocks[newBlock.arrIndex].from; i < freeBlocks[newBlock.arrIndex].from + blockLength; i++) {
        segment.children[i].style.background = blockBgColor;
        segment.children[i].style.cursor = 'pointer';
        segment.children[i].innerHTML = String(currentBlockIndex)
        segment.children[i].classList.add('block' + currentBlockIndex)
        segment.children[i].classList.add('occupied')
      }

    } else {
      let tmpBlockLength = blockLength
      for (const freeBlock of freeBlocks) {
        const pasteLength = freeBlock.to - freeBlock.from <= tmpBlockLength ? freeBlock.to : freeBlock.from + tmpBlockLength - 1
        tmpBlockLength -= freeBlock.to - freeBlock.from + 1
        for (let i = freeBlock.from; i <= pasteLength; i++) {
          segment.children[i].style.background = blockBgColor;
          segment.children[i].style.cursor = 'pointer';
          segment.children[i].innerHTML = String(currentBlockIndex)
          segment.children[i].classList.add('block' + currentBlockIndex)
          segment.children[i].classList.add('occupied')
        }
      }
    }

    currentLength += blockLength
    currentBlockIndex += 1
    updateFreeBlocks()
  } else {
    alert('Текущая длина отрезка: ' + currentLength + '. Введите другую длину блока')
  }
}

const init = (() => {
  for (let i = 0; i <= MAX_LENGTH - 1; i++) {
    const block = document.createElement('div');
    block.addEventListener('click', function () {
      document.querySelectorAll('.segment .active').forEach((item) => {
        item.classList.remove('active')
      })
      document.querySelectorAll(`.segment .${block.classList[0]}`).forEach(item => {
        item.classList.add('active')
      })
    })
    block.addEventListener('dblclick', function () {
      const blocksToDelete = document.querySelectorAll(`.segment .${block.classList[0]}`)
      currentLength -= blocksToDelete.length
      freeBlocksText.innerHTML = currentLength
      blocksToDelete.forEach(item => {
        item.innerHTML = ''
        item.classList.remove(...item.classList)
        item.style.background = ''
        item.style.cursor = 'initial';
      })
      updateFreeBlocks()
    })
    segment.appendChild(block)
  }
  return false
})()