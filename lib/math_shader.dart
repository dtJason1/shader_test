import 'dart:math';
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_shaders/flutter_shaders.dart';

class MathShaderWidget extends StatefulWidget {
  const MathShaderWidget({super.key});

  @override
  State<MathShaderWidget> createState() => _MathShaderWidgetState();
}

class _MathShaderWidgetState extends State<MathShaderWidget> with SingleTickerProviderStateMixin {
  late Ticker _ticker;

  Duration _currentTime = Duration.zero;
  late double _width, _height;
  @override
  void initState() {

    super.initState();


    _ticker = createTicker((Duration elapsed) {
      setState(() {
        _currentTime = elapsed;
      });
    });
    _ticker.start();
  }

  @override
  void dispose() {
    _ticker.dispose();
    super.dispose();
  }



  @override
  Widget build(BuildContext context){
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.fromLTRB(70,0,0,0),
        child: Stack(
          children: [
            SizedBox(
              width: 800,
              height:800,
              child: ShaderBuilder(
                assetKey: 'assets/shaders/helloworld.frag',
                    (BuildContext context, FragmentShader shader, _) => CustomPaint(
                  size: MediaQuery.of(context).size,
                  painter: MathShaderPainter(shader, _currentTime),
                  // painter: MathCustomPainter(_currentTime),
                ),

                child: Column(
                  children: [
                    Text("hello world", style: TextStyle(color: Colors.red),),
                  ],
                ),

              ),
            ),
            Text("hello", style: TextStyle(color: Colors.red),),
          ],
        ),
      ),
    );
  }
}

class MathShaderPainter extends CustomPainter {
  final FragmentShader shader;
  final Duration currentTime;

  MathShaderPainter(
      this.shader,
      this.currentTime,
      );

  @override
  void paint(Canvas canvas, Size size) {
    shader.setFloat(0,800);
    shader.setFloat(1, 800 );

    shader.setFloat(2, currentTime.inMicroseconds.toDouble()*0.00011);
    final Paint paint = Paint()..shader = shader;
    canvas.drawRect(Offset.zero & size, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
