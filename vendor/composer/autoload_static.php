<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit764515d78a6dbd714ad1e6221a82a832
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'Phoenix\\Press\\Tests\\' => 20,
            'Phoenix\\Press\\' => 14,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Phoenix\\Press\\Tests\\' => 
        array (
            0 => __DIR__ . '/../..' . '/tests',
        ),
        'Phoenix\\Press\\' => 
        array (
            0 => __DIR__ . '/../..' . '/includes',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit764515d78a6dbd714ad1e6221a82a832::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit764515d78a6dbd714ad1e6221a82a832::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit764515d78a6dbd714ad1e6221a82a832::$classMap;

        }, null, ClassLoader::class);
    }
}
