<?php

declare(strict_types=1);

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\Operation;
use ApiPlatform\Core\OpenApi\Model\PathItem;
use ApiPlatform\Core\OpenApi\Model\RequestBody;
use ApiPlatform\Core\OpenApi\OpenApi;

final class JwtDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $schemas = $openApi->getComponents()->getSchemas();

        $schemas['Token'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'token' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
                'refreshToken' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
            ],
        ]);

        $schemas['RefreshToken'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'refreshToken' => [
                    'type' => 'string',
                ],
            ],
        ]);
        $schemas['Credentials'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'username' => [
                    'type' => 'string',
                    'example' => 'johndoe',
                ],
                'password' => [
                    'type' => 'string',
                    'example' => 'apassword',
                ],
            ],
        ]);

        $loginPathItem = new PathItem(
            ref: 'JWT Token',
            post: new Operation(
            operationId: 'postCredentialsItem',
            tags: ['Authentication'],
            responses: [
            '200' => [
                'description' => 'Get JWT tokens',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            '$ref' => '#/components/schemas/Token',
                        ],
                    ],
                ],
            ],
        ],
            summary: 'Get JWT token to login.',
            requestBody: new RequestBody(
            description: 'Generate new JWT Token',
            content: new \ArrayObject([
            'application/json' => [
                'schema' => [
                    '$ref' => '#/components/schemas/Credentials',
                ],
            ],
        ]),
        ),
        ),
        );

        $refreshPathItem = new PathItem(
            ref: 'Refresh Token',
            post: new Operation(
            operationId: 'postRefreshItem',
            tags: ['Authentication'],
            responses: [
                '200' => [
                    'description' => 'Get fresh new JWT tokens',
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Token',
                            ],
                        ],
                    ],
                ],
            ],
            summary: 'Get fresh new JWT tokens.',
            requestBody: new RequestBody(
            description: 'Generate new JWT Token',
            content: new \ArrayObject([
                'application/json' => [
                    'schema' => [
                        '$ref' => '#/components/schemas/RefreshToken',
                    ],
                ],
            ]),
        ),
        ),
        );

        $loginPathItem = new PathItem(
            ref: 'JWT Token',
            post: new Operation(
            operationId: 'postCredentialsItem',
            tags: ['Authentication'],
            responses: [
            '200' => [
                'description' => 'Get JWT tokens',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            '$ref' => '#/components/schemas/Token',
                        ],
                    ],
                ],
            ],
        ],
            summary: 'Get JWT token to login.',
            requestBody: new RequestBody(
            description: 'Generate new JWT Token',
            content: new \ArrayObject([
            'application/json' => [
                'schema' => [
                    '$ref' => '#/components/schemas/Credentials',
                ],
            ],
        ]),
        ),
        ),
        );

        $refreshPathItem = new PathItem(
            ref: 'Refresh Token',
            post: new Operation(
            operationId: 'postRefreshItem',
            tags: ['Authentication'],
            responses: [
            '200' => [
                'description' => 'Get fresh new JWT tokens',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            '$ref' => '#/components/schemas/Token',
                        ],
                    ],
                ],
            ],
        ],
            summary: 'Get fresh new JWT tokens.',
            requestBody: new RequestBody(
            description: 'Generate new JWT Token',
            content: new \ArrayObject([
            'application/json' => [
                'schema' => [
                    '$ref' => '#/components/schemas/RefreshToken',
                ],
            ],
        ]),
        ),
        ),
        );

        $mePathItem = new PathItem(
            ref: 'Get current user',
            get: new Operation(
            operationId: 'getAuthUser',
            tags: ['Authentication'],
            responses: [
            '200' => [
                'description' => 'Get current user.',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            '$ref' => '#/components/schemas/User-user.read',
                        ],
                    ],
                ],
            ],
        ],
            summary: 'Get current user.',
        ),
        );
        $openApi->getPaths()->addPath('/auth/login', $loginPathItem);
        $openApi->getPaths()->addPath('/auth/refresh', $refreshPathItem);
        $openApi->getPaths()->addPath('/auth/me', $mePathItem);

        return $openApi;
    }
}
