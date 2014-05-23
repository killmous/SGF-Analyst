use strict;
use warnings;
use Test::More;


use Catalyst::Test 'sgfanalyst';
use sgfanalyst::Controller::Analysis;

ok( request('/analysis')->is_success, 'Request should succeed' );
done_testing();
