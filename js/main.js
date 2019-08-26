window.onload = init
window.onresize = resize

let scene, camera, renderer, vehicle, control, ui
let editor
let up

const BUILD = '20190823-1A'
let TEST = false
let IMPORT = false
let BG = 0x101010

let TIME = 0
let DT = 0
let FPS = 0

let MODE = 0
let LOAD = 0

let MOBILE = false

function init(){

  let bg = new THREE.Color(BG)
  scene = new THREE.Scene()
  scene.background = bg
  scene.fog = new THREE.FogExp2(BG, 0.02);

  up = new THREE.Vector3(0,0,1)
  camera = new THREE.PerspectiveCamera()
//   camera = new THREE.OrthographicCamera()

  camera.up = up
  camera.lookAt(0,0,0)

    camera.fov   = 50
    camera.near  = 0.001
    camera.far   = 10000
    
    camera.name = 'Camera'
    scene.add(camera)

  renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true, antialias: false })
  //renderer.setPixelRatio(1)
  renderer.setClearColor(bg)
  renderer.domElement.id = 'renderer';
  document.body.appendChild(renderer.domElement)
 
  vehicle = new Vehicle()

  control = new Control()
  control.connect()

  editor = new Editor()
  editor.connect()
  
  ui = new UI()
  ui.connect()
  
  window.addEventListener('touchmove', activateTouch )
  vehicle = new Vehicle()

  load()

}

function activateTouch(){
	MOBILE = true
	window.removeEventListener('touchmove', activateTouch)
}

function resize(){

  var w = window.innerWidth
  var h = window.innerHeight

  renderer.setSize(w,h)

  if ( camera.isPerspectiveCamera ){
  camera.aspect = w/h
  }
  else {
  camera.top    = h/-2
  camera.bottom = h/2
  camera.left   = w/-2
  camera.right  = w/2
  }
  camera.updateProjectionMatrix()
  ui.resize()
}

function load(){

  if( LOAD == 3 ){
	  ui.clear()	
	  titleBar() 
	  editor.disconnect()
	  vehicle.connect( new THREE.Vector3(0,10,30), editor.surface )
	  main()
  }
  else if( LOAD == 2 ){
	  camera.position.copy( editor.segments.geometry.vertices[ editor.segments.geometry.vertices.length/2 ])
	  camera.lookAt(camera.position)
	  camera.position.z -= 600
	  
	  editor.generateMesh()
	  LOAD++
	  renderer.render( scene, camera )
	  window.requestAnimationFrame( load )
  }
  else if( LOAD == 1 ){
	  titleBar()
	  editor.import()
	  ui.textbox('generating terrain mesh...', 2, 9 )
	  LOAD ++
	  window.requestAnimationFrame( load )
  }
  else if( LOAD == 0 ){
	  if( ui.load ){
	  resize()
	  mainMenu()
	  titleBar()
	  }
	  window.requestAnimationFrame( load )
	  renderer.render(scene, camera)
  }

}

function mainMenu(){

  ui.textbox('keybinds', 2, ui.yl-24)
  ui.textbox('main menu           enter', 2, ui.yl-20)
  ui.textbox('control vehicle     arrow keys', 2, ui.yl-18)
  ui.textbox('reset stage         r', 2, ui.yl-16)

  ui.button('start', function(){

  	LOAD++
  	ui.clear()
	titleBar()
  	ui.textbox('generating stage path...', 2, 9 )

  }, 2, ui.yl-12, ui.xl-4, 6)

}

function titleBar(){
	ui.textbox('special stage - development build',  2, 3 )
	ui.textbox('-', 2, 6 )
}

function main(){

	FPS = Math.round( 1000 / ( performance.now()-TIME ) )
	TIME = performance.now()

	const fps = 'fps ' + FPS
  	ui.textbox(fps,  2, ui.yl-3 )
	
  	ui.button('generate new stage', function(){
		ui.clear()
		renderer.clear()
  		ui.textbox('generating stage path...', 2, 9 )
	    titleBar()

		vehicle.disconnect()
  		editor.reset()
  		editor.connect()
  		LOAD = 0

  	}, 2, 8, ui.xl-2, 4)

  	if( MOBILE ){
  		ui.dpad()
  	}

	vehicle.update()
	renderer.render(scene, camera)
	if( LOAD == 0 ){
	LOAD = 1
	window.requestAnimationFrame(load)
	}
	else{
	window.requestAnimationFrame(main)
	}

}

function main_game(){

}

function main_menu(){

}
