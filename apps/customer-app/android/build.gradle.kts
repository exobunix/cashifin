allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}

subprojects {
    val configureAction = Action<Project> {
        val androidExt = project.extensions.findByName("android")
        if (androidExt != null) {
            try {
                val method = androidExt.javaClass.getMethod("compileSdkVersion", Int::class.javaPrimitiveType)
                method.invoke(androidExt, 36)
            } catch (e: Exception) {
                try {
                    val method = androidExt.javaClass.getMethod("setCompileSdkVersion", Int::class.javaPrimitiveType)
                    method.invoke(androidExt, 36)
                } catch (e2: Exception) {}
            }
            try {
                val defaultConfig = androidExt.javaClass.getMethod("getDefaultConfig").invoke(androidExt)
                try {
                    defaultConfig.javaClass.getMethod("targetSdkVersion", Int::class.javaPrimitiveType).invoke(defaultConfig, 36)
                } catch (ex: Exception) {
                    try {
                        defaultConfig.javaClass.getMethod("setTargetSdkVersion", Int::class.javaPrimitiveType).invoke(defaultConfig, 36)
                    } catch (ex2: Exception) {}
                }
            } catch (e: Exception) {}
        }
    }
    if (project.state.executed) {
        configureAction.execute(project)
    } else {
        project.afterEvaluate(configureAction)
    }
}

subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
