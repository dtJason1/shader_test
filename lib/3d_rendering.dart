import 'package:flutter/material.dart';
import 'package:simple_3d/simple_3d.dart';
import 'package:util_simple_3d/util_simple_3d.dart';
import 'package:simple_3d_renderer/simple_3d_renderer.dart';
import 'package:ditredi/ditredi.dart';
import 'package:vector_math/vector_math_64.dart' as vector;

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  var _displayMode = DisplayMode.cubes;
  final _cubes = _generateCubes();
  final _points = _generatePoints().toList();

  final _controller = DiTreDiController(
    rotationX: -20,
    rotationY: 30,
    light: vector.Vector3(2, 1, 1),
  );

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      darkTheme: ThemeData.dark(),
      title: 'DiTreDi Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        body: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [

              Container(
                width: 500,
                height: 500,
                child: FutureBuilder(future:  ObjParser().loadFromResources("assets/face5764.obj"), builder: (BuildContext context, AsyncSnapshot snapshot ){
                  //해당 부분은 data를 아직 받아 오지 못했을때 실행되는 부분을 의미한다.
                  if (snapshot.hasData == false) {
                    return Text("ERRORRRRR", style: TextStyle(fontSize: 30),);
                  }
                  //error가 발생하게 될 경우 반환하게 되는 부분
                  else if (snapshot.hasError) {
                    return Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        'Error: ${snapshot.error}',
                        style: TextStyle(fontSize: 15),
                      ),
                    );
                  }
                  // 데이터를 정상적으로 받아오게 되면 다음 부분을 실행하게 되는 것이다.
                  else {
                    return  Expanded(
                      child: DiTreDiDraggable(
                        controller: _controller,
                        child: DiTreDi(
                          figures: [
                            Mesh3D( snapshot.data),
                          ],
                          controller: _controller,

                          config: const DiTreDiConfig(
                            supportZIndex: true,
                          ),
                        ),
                      ),
                    );

                  }



                }),
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text("Drag to rotate. Scroll to zoom"),
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: DisplayMode.values
                    .map((e) => Material(
                  child: InkWell(
                    onTap: () => setState(() => _displayMode = e),
                    child: ListTile(
                      title: Text(e.title),
                      leading: Radio<DisplayMode>(
                        value: e,
                        groupValue: _displayMode,
                        onChanged: (e) => setState(
                              () => _displayMode = e ?? DisplayMode.cubes,
                        ),
                      ),
                    ),
                  ),
                ))
                    .toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}


Iterable<Cube3D> _generateCubes() sync* {
  final colors = [
    Colors.grey.shade200,
    Colors.grey.shade300,
    Colors.grey.shade400,
    Colors.grey.shade500,
    Colors.grey.shade600,
    Colors.grey.shade700,
    Colors.grey.shade800,
    Colors.grey.shade900,
  ];

  const count = 8;
  for (var x = count; x > 0; x--) {
    for (var y = count; y > 0; y--) {
      for (var z = count; z > 0; z--) {
        yield Cube3D(
          0.9,
          vector.Vector3(
            x.toDouble() * 2,
            y.toDouble() * 2,
            z.toDouble() * 2,
          ),
          color: colors[(colors.length - y) % colors.length],
        );
      }
    }
  }
}

Iterable<Point3D> _generatePoints() sync* {
  for (var x = 0; x < 10; x++) {
    for (var y = 0; y < 10; y++) {
      for (var z = 0; z < 10; z++) {
        yield Point3D(
          vector.Vector3(
            x.toDouble() * 2,
            y.toDouble() * 2,
            z.toDouble() * 2,
          ),
        );
      }
    }
  }
}

enum DisplayMode {
  cubes,
  wireframe,
  points,
}

extension DisplayModeTitle on DisplayMode {
  String get title {
    switch (this) {
      case DisplayMode.cubes:
        return "Cubes";
      case DisplayMode.wireframe:
        return "Wireframe";
      case DisplayMode.points:
        return "Points";
    }
  }
}