var game={
	CN:800,//宽度
	RN:400,//高度
	data:null,//背景空数组
	timer:null,//定时器
	interval:100,//时间间隔
	FOOD:[],//食物坐标
	SNAKE:[],//蛇坐标
	state:1,//游戏状态
	SCORE:0,//游戏得分
	direction:"left",//方向状态
	RUNNING:1,//游戏运行中
	GAMEOVER:0,//游戏结束
	start:function(){
		this.state=this.RUNNING;
		this.data=[];
		for(var r=0;r<this.RN/20;r++){
			this.data[r]=[];
			for(var c=0;c<this.CN/20;c++){
				this.data[r][c]=0;
			}
		}
		var over=document.getElementById("gameOver");
		over.style.display="none";
		//随机出现蛇的位置
		this.randomSnake();
		this.moveRight();
		//随机出现食物的位置
		this.randomFood();
		document.onkeydown=function(e){
			e.preventDefault();
			switch(e.keyCode){
				case 37:
					if(this.direction!="right"&&this.direction!="left"){
						this.moveLeft();
					}
					break;
				case 38:
					if(this.direction!="down"&&this.direction!="up"){
						this.moveUp();
					}
					break;
				case 39:
					if(this.direction!="left"&&this.direction!="right"){
						this.moveRight();
					}
					break;
				case 40:
					if(this.direction!="up"&&this.direction!="down"){
						this.moveDown();
					}
					break;
			}
		}.bind(this);
	},
	isHitSelf:function(){//判断是否撞到自己
		for(var i=1;i<this.SNAKE.length;i++){
			if(this.SNAKE[0][0]==this.SNAKE[i][0]
			 &&this.SNAKE[0][1]==this.SNAKE[i][1]){
				return true;
			}
		}
	},
	isHitWall:function(){//判断是否撞到墙
		if(this.SNAKE[0][1]==-1||this.SNAKE[0][1]==this.CN/20||
		   this.SNAKE[0][0]==-1||this.SNAKE[0][0]==this.RN/20){
			return true;
		}
	},
	isGameOver:function(){//判断是否游戏结束
		var r=this.isHitSelf();
		var c=this.isHitWall();
		if(r==true||c==true){
			var over=document.getElementById("gameOver");
			over.style.display="block";
			var fscore=document.getElementById("fScore");
			fscore.innerHTML=this.SCORE;
			//停止定时器
			clearInterval(this.timer);
			this.timer=null;
			//删除页面上所有div
			var divMap=document.getElementById("map");
			var bodies=document.getElementsByClassName("body");
			for(var i=bodies.length-1;i>=0;i--){
				divMap.removeChild(bodies[i]);
			}
			var foods=document.getElementsByClassName("food");
			for(var i=foods.length-1;i>=0;i--){
				divMap.removeChild(foods[i]);
			}
			return true;
		}
			return false;
	},
	eatFood:function(){//吃到食物
		if(this.SNAKE[0][0]==this.FOOD[this.FOOD.length-2]
			&&this.SNAKE[0][1]==this.FOOD[this.FOOD.length-1]){
			this.SCORE++;
			return true;
		}else{
			return false;
		}
	},
	moveIn:function(SNAKE){//移动重构函数
		var divMap=document.getElementById("map");
		var foods=document.getElementsByClassName("body");
		for(var i=foods.length-1;i>=0;i--){//删除原有的蛇
			divMap.removeChild(foods[i]);
		}
		for(var i=0;i<SNAKE.length;i++){//创建新蛇
			var div=document.createElement("div");
			div.className="body";
			div.style.top=SNAKE[i][0]*20+"px";
			div.style.left=SNAKE[i][1]*20+"px"
			divMap.appendChild(div);
		}		
	},
	move:function(dic){//定时器重构函数
			clearInterval(this.timer);
			this.timer=null;
			this.timer=setInterval(dic.bind(this),this.interval);
	},
	moveLeft:function(){//向左移动
		this.move(this.moveLeftInCol);
	},
	moveLeftInCol:function(){//向左移动1步
			//增加新的头部
			this.SNAKE.unshift([this.SNAKE[0][0],this.SNAKE[0][1]-1]);
			//删除尾部
					  //   r                       c
			this.SNAKE.pop();
			if(!this.isGameOver()){
				this.moveIn(this.SNAKE);
			}
			if(this.eatFood()){
				this.SNAKE.push([this.SNAKE[this.SNAKE.length-1][0]
								,this.SNAKE[this.SNAKE.length-1][1]]);
				//this.FOOD.pop();
				if(this.SNAKE[0][1]>0){
					this.moveIn(this.SNAKE);
				}
				var divMap=document.getElementById("map");
				var food=document.getElementsByClassName("food")[0];
				divMap.removeChild(food);
				var span=document.getElementById("score");
				span.innerHTML=this.SCORE;
				this.randomFood();
			}
			this.direction="left";			
	},
	moveRight:function(){//向右移动
		this.move(this.moveRightInCol);
	},
	moveRightInCol:function(){//向右移动1步		
			//增加新的头部
			this.SNAKE.unshift([this.SNAKE[0][0],this.SNAKE[0][1]+1]);
			//删除尾部		  //   r                       c
			this.SNAKE.pop();
			if(!this.isGameOver()){
				this.moveIn(this.SNAKE);
			}
			if(this.eatFood()){
				this.SNAKE.push([this.SNAKE[this.SNAKE.length-1][0]
								,this.SNAKE[this.SNAKE.length-1][1]]);
				//this.FOOD.pop();
				this.moveIn(this.SNAKE);
				var divMap=document.getElementById("map");
				var food=document.getElementsByClassName("food")[0];
				divMap.removeChild(food);
				var span=document.getElementById("score");
				span.innerHTML=this.SCORE;
				this.randomFood();
			}
			this.direction="right";	
	},
	moveUp:function(){//向上移动
		this.move(this.moveUpInRow);
	},
	moveUpInRow:function(){//向上移动1步
			//新增加一个头部
			this.SNAKE.unshift([this.SNAKE[0][0]-1,this.SNAKE[0][1]]);
			//去掉尾巴		      //   r                       c
			this.SNAKE.pop();
			if(!this.isGameOver()){
				this.moveIn(this.SNAKE);
			}
			if(this.eatFood()){
				this.SNAKE.push([this.SNAKE[this.SNAKE.length-1][0]
								,this.SNAKE[this.SNAKE.length-1][1]]);
				this.moveIn(this.SNAKE);
				var divMap=document.getElementById("map");
				var food=document.getElementsByClassName("food")[0];
				divMap.removeChild(food);
				var span=document.getElementById("score");
				span.innerHTML=this.SCORE;
				this.randomFood();
			}
			this.direction="up";
	},
	moveDown:function(){//向下移动
		this.move(this.moveDownInRow);
	},
	moveDownInRow:function(){//向下移动1步
			//新增加一个头部
			this.SNAKE.unshift([this.SNAKE[0][0]+1,this.SNAKE[0][1]]);
			//去掉尾巴		      //   r                       c
			this.SNAKE.pop();
			if(!this.isGameOver()){
				this.moveIn(this.SNAKE);
			}
			if(this.eatFood()){
				this.SNAKE.push([this.SNAKE[this.SNAKE.length-1][0]
								,this.SNAKE[this.SNAKE.length-1][1]]);
				this.moveIn(this.SNAKE);
				var divMap=document.getElementById("map");
				var food=document.getElementsByClassName("food")[0];
				divMap.removeChild(food);
				var span=document.getElementById("score");
				span.innerHTML=this.SCORE;
				this.randomFood();
			}
			this.direction="down";
	},
	randomSnake:function(){//随机snake出现的位置
		//生成蛇的头部
		var r=Math.floor(Math.random()*(this.RN/20-3-3+1)+3);
		var c=Math.floor(Math.random()*(this.CN/20-3-3+1)+3);
		this.SNAKE.push([r,c]);
		this.SNAKE.push([r,c-1]);
		this.SNAKE.push([r,c-2]);
		var divMap=document.getElementById("map");
		//遍历地图中的坐标
		for(var i=0;i<this.SNAKE.length;i++){
			var div=document.createElement("div");
			div.className="body";
			div.style.top=this.SNAKE[i][0]*20+"px";
			div.style.left=this.SNAKE[i][1]*20+"px";
			divMap.appendChild(div);	
		}
	},
	randomFood:function(){
			//随机生成横坐标
			var r=Math.floor(Math.random()*(this.RN/20));
			//随机生成纵坐标
			var c=Math.floor(Math.random()*(this.CN/20));
			this.FOOD.push(r);
			this.FOOD.push(c);
			var divMap=document.getElementById("map");
			var div=document.createElement("div");
			div.className="food";
			div.style.top=r*20+"px";
			div.style.left=c*20+"px";	
			divMap.appendChild(div);
	}
};

var btn_start=document.getElementsByClassName('btn-start')[0];
btn_start.onclick=function(e){
	e.preve
	btn_start.style.display='none';
	game.start();
}

